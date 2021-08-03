'use strict';

const mysql = require("mysql2");
const config = require('../config/config')();

class Model {
  connection;
  constructor(table) {
      this.table = table;  
  }
  async save(data) {
    let keys = [];
    let values = [];
    let update = [];
    let query;
    for(let key in data) {
        if(key !== "id") {
            keys.push(key);
            values.push(`'${data[key]}'`);
            update.push(`${key}='${data[key]}'`);
        }
    }
    if(data.id) {
        query = `UPDATE ${this.table} SET ${update} WHERE id=${data.id};`;
    } else {
        query = `INSERT ${this.table} (${keys}) VALUES (${values});`;
    }
      // console.log(query);
    let [rows,fields] = await this._connect(query);

    return rows;
  }

  async getList(data, sort = []) {
      let query;
      console.log(sort.length);
    let arr = [];
    for(let key in data) {
        // if(key !== "id") {
            arr.push(`${key}='${data[key]}'`);
        // }
    }
      // console.log(arr);

    if(sort.length > 0) {
        query = `SELECT * FROM ${this.table}` + (arr.length > 0 ? ` WHERE ${arr.join(' AND ')}` : '') + `ORDER BY ${sort[0]} ${sort[1]};`;
    } else {
        query = `SELECT * FROM ${this.table}` + (arr.length > 0 ? ` WHERE ${arr.join(' AND ')};` : ';');
    }
      // console.log(query);
    let [rows,fields] = await this._connect(query);
    //return this._toArray(rows);
    //   console.log(rows);
    return rows;
  }

  _toArray(row) {
      let result = [];
      let obj = {};
      row.forEach((item) => {
          obj = {};
          for(let key in item) {
              obj[key] = item[key];
          }
          result.push(obj);
      });
      return result;
  }
  async getOne(data) {
      return (await this.getList(data))[0];
  }
    async getLast(data) {
      let result = await this.getList(data, ['created_at', 'desc']);
      if(result) {
          return result[0];
      } else {
          return [];
      }
    }


  _connect(query) {
      console.log(query);
    this.connection = mysql.createConnection({ 
        host     : config.dbtest ? config.db_test.host : config.db.host,
        user     : config.dbtest ? config.db_test.user : config.db.user,
        password : config.dbtest ? config.db_test.password : config.db.password,
        database : config.dbtest ? config.db_test.name : config.db.name
    });
    this.connection.connect();
    let result;
    try {
        result = this.connection.promise().query(query);
    } catch (err) {
        console.error(err)
    }
    this.connection.end();
    return result;
  }
}

module.exports = Model;