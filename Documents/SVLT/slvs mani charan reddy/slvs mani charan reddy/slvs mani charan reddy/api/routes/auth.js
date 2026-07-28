const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db/init');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

function generateToken(user) {
  const payload = { id: user.id, email: user.email, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '24h' });
}

function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function assertPassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

// Public self-registration (shipper, driver, fleet_owner only — admin accounts require admin creation)
router.post('/register', async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = req.body.password;
  const name = req.body.name;
  const role = String(req.body.role || '').toLowerCase();
  const company_name = req.body.company_name;
  const license_number = req.body.license_number;

  if (!email || !password || !role) return res.status(400).json({ error: 'email, password and role required' });
  if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email address' });
  if (!assertPassword(password)) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  // Public registration only allows non-admin roles
  const allowedRoles = ['driver', 'fleet_owner', 'shipper'];
  if (!allowedRoles.includes(role)) {
    return res.status(403).json({ error: 'Invalid role. Allowed: driver, fleet_owner, shipper' });
  }

  // Check if user exists
  db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) return res.status(409).json({ error: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user_id = uuidv4();
    
    db.run(
      'INSERT INTO users (id, email, password_hash, name, role, is_verified) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, email, hash, name || '', role, 1],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });

        // Role-specific setup
        if (role === 'fleet_owner' && company_name) {
          const company_id = uuidv4();
          db.run(
            'INSERT INTO companies (id, owner_user_id, name) VALUES (?, ?, ?)',
            [company_id, user_id, company_name]
          );
        } else if (role === 'driver' && license_number) {
          const profile_id = uuidv4();
          db.run(
            'INSERT INTO driver_profiles (id, user_id, license_number, license_expiry, experience_years) VALUES (?, ?, ?, ?, ?)',
            [profile_id, user_id, license_number, null, 0]
          );
        }

        const token = generateToken({ id: user_id, email, role });
        res.status(201).json({ 
          message: 'Account created successfully',
          token,
          user: { id: user_id, email, role, name: name || '' } 
        });
      }
    );
  });
});

// Admin-only: create any user including admins
router.post('/admin/create-user', authMiddleware, requireRole('admin'), async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = req.body.password;
  const name = req.body.name;
  const role = String(req.body.role || '').toLowerCase();
  const company_name = req.body.company_name;
  const license_number = req.body.license_number;

  if (!email || !password || !role) return res.status(400).json({ error: 'email, password and role required' });
  if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email address' });
  if (!assertPassword(password)) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) return res.status(409).json({ error: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user_id = uuidv4();

    db.run(
      'INSERT INTO users (id, email, password_hash, name, role, is_verified) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, email, hash, name || '', role, 1],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });

        if (role === 'fleet_owner' && company_name) {
          const company_id = uuidv4();
          db.run('INSERT INTO companies (id, owner_user_id, name) VALUES (?, ?, ?)', [company_id, user_id, company_name]);
        } else if (role === 'driver' && license_number) {
          const profile_id = uuidv4();
          db.run(
            'INSERT INTO driver_profiles (id, user_id, license_number, license_expiry, experience_years) VALUES (?, ?, ?, ?, ?)',
            [profile_id, user_id, license_number, null, 0]
          );
        }

        res.status(201).json({ message: 'User created successfully', user: { id: user_id, email, role, name: name || '' } });
      }
    );
  });
});

// Login
router.post('/login', async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = req.body.password;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email address' });

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
  });
});

// Get current user
router.get('/me', authMiddleware, (req, res) => {
  db.get('SELECT id, email, name, role, is_verified, created_at FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  });
});

// Update profile
router.put('/me', authMiddleware, (req, res) => {
  const { name, phone } = req.body;
  
  db.run(
    'UPDATE users SET name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name || null, phone || null, req.user.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true });
    }
  );
});

module.exports = router;
