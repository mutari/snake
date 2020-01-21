const express = require('express');
const app = express();

const port = 80;

app.use(express.static(__dirname + '/public'));


app.listen(port, err => {

	if(err) console.log(err);
	else console.log(`server started an running on port: ${port}`);

})
