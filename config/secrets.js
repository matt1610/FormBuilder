

module.exports = {
	DBURI : 'mongodb://mattstarkey:element@ds038888.mongolab.com:38888/formbuilder',
	// DBURI : process.env.DBURI,
	emailOptions : {
	    service: 'SendGrid',
	    auth: {
	        user: process.env.SGUSER,
	        pass: process.env.SGPASS
	    }
	}
}

