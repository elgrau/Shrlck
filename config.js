var config = {}

config.parse = {};

config.web = {};
config.session = {};
config.folders = {};
config.email = {};

// baseUrl
//config.web.baseUrl = 'http://authenticate-app-me.herokuapp.com';
config.web.baseUrl = 'http://localhost:3000';

// folder files
config.folders.files = './uploads/';
config.folders.sizeupload = 3145728; // 3MB

// parse configuration
config.parse.appId = process.env['PARSE_API_KEY_ID'] || "QOryY35VgLrpatXq6TJ7E4RvB2wryjSWmvR8VvBF";
config.parse.jsKey = process.env['PARSE_API_JS_KEY'] || "z48SyHsUL7zxvBqwyP1ILBPWjdTWlJEcXRGBW3zF";
config.parse.masterKey = process.env['PARSE_MASTER_KEY'] || "j9t6fCk92XSPQA1gX4S4mvV6AdvThFnaruRBpF4r";

//session secret
config.session.secret = process.env.EXPRESS_SECRET || "fa2d5588dbef6144f7aa8688577bf89c2ff0686a85d4cbffb0d59779d13ee9e0a5e2c2d9792212c6";

//Email configuration
config.email.service = "Gmail";
config.email.user = "miguelangelgraumartinez@gmail.com";
config.email.clientId = "214814955377-v5o9qab9v7cumnqlf8amjvo47bs45qq4.apps.googleusercontent.com";
config.email.clientSecret = "JZBLWeiAbAjtNXEfvJz6nGug";
config.email.refreshToken = "1/HVjEgIx1zT6-qPAW_p_3E3O5Bjqgl5t1KijGAv3XpGNIgOrJDtdun6zK6XiATCKT";
config.email.accessToken = "ya29.dAIMAxpcONMCIsPE-bMXjE2fI1PNxe8TWWS3zDtKizTqgz-ZKYVmYla-7hqyx6MobbKk";
config.email.timeout = 3600;

module.exports = config;