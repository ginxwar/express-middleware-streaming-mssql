const mssql = require('mssql')

const runSqlInPool = pool => sql => (req, res, next) => {
  const request = new mssql.Request(pool)

  //TODO: can we get information about the pool size and what connection number we are?
  // console.log(pool);
  request.stream = true // You can set streaming differently for each request

  request.query(sql)

  request.on('recordset', columns => {
    res.set({
      'Content-Type': 'application/json; charset=utf-8'
    })
  })

  request.on('row', row => {
    res.write(JSON.stringify(row))
  })

  request.on('error', err => {
    // May be emitted multiple times
    //TODO: what happens when it is emitted multiple times?
    return next(err)
  })

  request.on('done', result => {
    res.end()
    return next()
  })
}

export default runSqlInPool
