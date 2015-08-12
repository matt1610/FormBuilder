

module.exports = {
	DBURI : process.env.DBURI,
	emailOptions : {
	    service: 'SendGrid',
	    auth: {
	        user: process.env.SGUSER,
	        pass: process.env.SGPASS
	    }
	}
}
