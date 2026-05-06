const {
  findCustomerByEmail,
  findCustomerByAccountNumber,
  findCustomerById,
  insertCustomer,
  getAllCustomers,
  getAllCustomersOnly,
  updateCustomer,
  deleteCustomer
} = require('../utils/distributedDb');

class Customer {
  static async create(customerData) {
    const { accountNumber, name, email, phone, password, address, district, role } = customerData;
    return insertCustomer({ accountNumber, name, email, phone, password, address, district, role: role || 'customer' });
  }

  static async findByEmail(email) {
    return findCustomerByEmail(email);
  }

  static async findByAccountNumber(accountNumber) {
    return findCustomerByAccountNumber(accountNumber);
  }

  static async findById(id) {
    return findCustomerById(id);
  }

  static async getAll() {
    return getAllCustomers();
  }

  static async getAllCustomersOnly() {
    return getAllCustomersOnly();
  }

  static async updateRole(customerId, role) {
    return updateCustomer(customerId, { role });
  }

  static async updateStatus(customerId, status) {
    return updateCustomer(customerId, { status });
  }

  static async update(customerId, fields) {
    return updateCustomer(customerId, fields);
  }

  static async delete(customerId) {
    return deleteCustomer(customerId);
  }
}

module.exports = Customer;
