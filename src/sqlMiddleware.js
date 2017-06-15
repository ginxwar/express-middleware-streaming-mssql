const mssql = require('mssql')

const runSqlInPool = pool => sql => (req, res, next) => {
  // keeps track of the row index.  The count is unknown because we are streaming
  let rowIndex = 0

  const request = new mssql.Request(pool)

  //TODO: can we get information about the pool size and what connection number we are?
  // console.log(pool);
  request.stream = true // You can set streaming differently for each request

  request.query(sql)

  request.on('recordset', columns => {
    res.set({
      'Content-Type': 'application/json; charset=utf-8'
    })
    res.write('[')
  })

  request.on('row', row => {
    if (rowIndex > 0) {
      res.write(',')
    }

    res.write(JSON.stringify(row))

    rowIndex++
  })

  request.on('error', err => {
    // May be emitted multiple times
    //TODO: what happens when it is emitted multiple times?
    return next(err)
  })

  request.on('done', result => {
    res.write(']')
    res.end()
    return next()
  })
}

module.exports = runSqlInPool
