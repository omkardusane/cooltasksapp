module.exports = async (req, res, next)=>{
    let username = req.headers['username'];
    if (!!username) {
        username = username.toLowerCase();
        req.username = username;
        if (await db.users.count({ name: username }) > 0) {
            next();
        } else {
            db.users.insert({ name: username, createdOn: new Date().getTime() });
            next();
        };
    } else {
        res.status(401);
        res.json({ ok: false, msg: 'no username present in header' })
    }
}