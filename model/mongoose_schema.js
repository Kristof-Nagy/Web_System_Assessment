const mongoose = reuqire("mongoose");

const LoginSchema = new mongoose.Schema({
	username:{ type: String, required: true, unique: true },
	password:{ type: String, required: true }
})

module.exports = mongoose.model( name:"Login", LoginSchema, collection:"Users");
