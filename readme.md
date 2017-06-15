# An Express Middleware for Streaming SQL

A really simple SQL streaming express middleware using implementation from  [node-mssql](https://github.com/patriksimek/node-mssql).

## Install
```
npm install express-middleware-streaming-mssql
```

## Example

```JS
import mssql from 'mssql'
import runSqlInPool from 'express-middleware-streaming-mssql'

// create your pool first
const pool = new mssql.ConnectionPool(/*config*/)

const runSql = runSqlInPool(pool)


app.get('/', runSql(`select top 1 * from sometable`))

```
