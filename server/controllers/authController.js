const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const postgresPool = require('../config/database/postgres');
require('dotenv').config();

const allowedRoles = ['customer', 'branch_manager', 'administrator'];

const cleanUser = (user) => ({
  id: user.customer_id,
  name: user.name,
  email: user.email,
  role: user.role,
  accountNumber: user.account_number,
  phone: user.phone,
  address: user.address,
  district: user.district,
  status: user.status
});

const createToken = (user) => {
  return jwt.sign(
    {
      id: user.customer_id,
      email: user.email,
      role: user.role,
      accountNumber: user.account_number,
      name: user.name
    },
    process.env.JWT_SECRET || 'wasco_super_secret_key_2024',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

const register = async (req, res) => {
  const {
    name,
    email,
    accountNumber,
    phone,
    password,
    address,
    district,
    role
  } = req.body;

  try {
    if (!name || !email || !accountNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, account number and password are required'
      });
    }

    const selectedRole = allowedRoles.includes(role) ? role : 'customer';

    const existingUser = await Customer.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const existingAccount = await Customer.findByAccountNumber(accountNumber);
    if (existingAccount) {
      return res.status(400).json({
        success: false,
        message: 'Account number already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Customer.create({
      accountNumber,
      name,
      email,
      phone,
      password: hashedPassword,
      address,
      district,
      role: selectedRole
    });

    await postgresPool.query(
      `INSERT INTO audit_logs (user_type, user_id, action, timestamp, ip_address, details)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5)`,
      [
        selectedRole,
        accountNumber,
        'registration',
        req.ip,
        JSON.stringify({ email, role: selectedRole })
      ]
    );

    const token = createToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: cleanUser(newUser)
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Customer.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is not active'
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = createToken(user);

    await postgresPool.query(
      `INSERT INTO audit_logs (user_type, user_id, action, timestamp, ip_address)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)`,
      [user.role, user.account_number, 'login', req.ip]
    );

    res.json({
      success: true,
      token,
      user: cleanUser(user)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await Customer.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: cleanUser(user)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getMe
};