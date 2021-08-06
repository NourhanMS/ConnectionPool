const mysql = require('mysql');
const util = require('util')
let  connection = null;
let  poolConnection = null;
const TRAFFIC_NUMBER = 50000;
let countdone = 0;

createconnection =  async  () => {
    connection = mysql.createConnection({
        host: "localhost",
        port: "3306",
        user: "nourhanms",
        password: "nour123",
        database:"rosca"
      });
      console.log("connecting");
      try{
        const asyncConnect = util.promisify(connection.connect).bind(connection);
        await asyncConnect();
        console.log("new connection created");
      }catch(error){
        console.log("error");
        throw new Error(error);
      }
}

createPoolConnection = async () => {
    poolConnection = mysql.createPool({
        connectionLimit : 140,
        host: "localhost",
        port: "3306",
        user: "nourhanms",
        password: "nour123",
        database:"rosca"
      });
    console.log("new pool connection created");
}
getConnection =  async () => {
    if( !connection )
         await createconnection();
    return connection;
  }

getPoolConnection = async () => {
    if( !poolConnection )
         await createPoolConnection();
    return poolConnection;
}

executeStatement = async (query,i,start) => {
    try{
        let connectionInstance =  await getConnection();
        const asyncQuery = util.promisify(connectionInstance.query).bind(connectionInstance);
        let result = await asyncQuery(query);
        console.log(`result>> ${i}`,result);
        countdone ++;
        if(countdone == TRAFFIC_NUMBER ){
            const end = new Date();
            console.log( " ******** time taken: " + Math.abs(end - start))
        }
    }catch(error){
        console.log("ooops!!");
        throw new Error(error);
    }

}

executePoolStatement = async (query,i,start) => {
    try{
        let poolConnectionInstance =  await getPoolConnection();
        const asyncQuery = util.promisify(poolConnectionInstance.query).bind(poolConnectionInstance);
        let result = await asyncQuery(query);
        console.log(`result>> ${i}`,result);
        countdone ++;
        if(countdone == TRAFFIC_NUMBER ){
            const end = new Date();
            console.log( " ******** time taken: " + Math.abs(end - start))
        }
    }catch(error){
        console.log("ooops!!");
        throw new Error(error);
    }

}

executeWithOneInstance = (query) => {
    let start = new Date();
    for(let i=0; i<TRAFFIC_NUMBER; i++){
        console.log(`executing statement ${i}`);
       executeStatement(query,i,start);
       console.log(`finished synch for ${i}`);
    }
}

executeWithPoolConnection = (query) => {
    let start = new Date();
    for(let i=0; i<TRAFFIC_NUMBER; i++){
        console.log(`executing statement ${i}`);
       executePoolStatement(query,i,start);
       console.log(`finished synch for ${i}`);
    }
}

//change TRAFFIC_NUMBER and try your query 
let query = `insert into partners (image) values ('ddddddd.png')`;
executeWithOneInstance(query);
// executeWithPoolConnection(query); 
