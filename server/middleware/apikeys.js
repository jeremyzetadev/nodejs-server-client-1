import {users} from '../data.js'
const MAX = process.env.API_MAX || 25

const genKey = () =>{
    //create a base-36 string that is always 30 chars long a-z0-9
    return [...Array(30)].map((e) => ((Math.random() * 36) | 0).toString(36)).join('');
}

export const createUser = (_email,req)=>{
    let today = new Date().toISOString().split('T')[0];
    let user = {
        _id:Date.now(),
        api_key:genKey(),
        email: _email,
        host: req.headers.origin,
        usage: [{date:today, count:0}],
    };

    console.log('add user');
    users.push(user);
    return user;
}

export const validateKey = (req, res, next) =>{
    let host = req.headers.origin;
    let api_key = req.headers('x-api-key');
    let account = users.find(
        (user) => user.host == host && user.api_key == api_key
    );

    if(account){
        let today = new Date().toISOString().split('T')[0];
        let usageIndex = account.usage.findIndex((day)=>day.date == today);
        if(usageIndex>=0){
            if(account.usage[usageIndex].count>=MAX){
                res.status(429).send({
                    error:{
                        code:429,
                        message: 'MAX API calls exceeded.',
                    },
                });
            } else {
                account.usage[usageIndex].count++;
                console.log('Good API call', account.usage[usageIndex]);
                next();
            }
        }else{
            account.usage.push({date:today, count:1});
            next();
        }
    } else {
        res.status(400).send({error: {code:403, message:'You are not allowed.'}});
    }
};