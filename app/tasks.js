let router = new express.Router()
module.exports = router;

// get all
router.get('/', async (req, res) => {
    // get username and get their all tasks
    console.log('yolo ', req.username);
    let list = await db.tasks.find({
        owner: req.username,
    }, { owner: 0 })
        .sort({ createdOn: -1 })
        .toArray();
    res.json({ ok: true, tasks: list });
});

// create
router.post('/', async (req, res) => {
    console.log('yolo ', req.username);
    let data = helpers.paramsMapValidator(req.body, [
        'what',
        'due'
    ]);
    if (data.missing) {
        res.json({ ok: false, msg: 'missing params' });
    }
    else {
        let cr = await db.tasks.insert(
            Object.assign(data, {
                pending: true,
                owner: req.username,
                createdOn: new Date().getTime()
            })
        );
        console.log('Yo', cr);
        if (cr.ops.length) {
            res.json({ ok: true, task: cr.ops[0] });
        } else {
            res.json({ ok: false, msg: 'could not create for some databse reason ' });
        }
    }
});

// update one
router.put('/', async (req, res) => {
    console.log('yolo ', req.body);
    if (!req.body.id) {
        res.status(400);
        return res.json({ ok: false, msg: 'send an id with request' })
    } else {
        const id = new ObjectId(req.body.id);
        let data = {};
        if (req.body['pending']) {
            data.pending = (req.body.pending === '1')
        }
        if (req.body['what']) {
            data.what = req.body.what;
        }
        if (req.body['due']) {
            data.due = req.body.due;
        }
        data.updatedOn = new Date().getTime();
        try {
            let cr = await db.tasks.update({
                _id: id,
                owner: req.username
            }, {
                    '$set': data
                }
            );
            console.log('Yo update ', cr.result);
            if (cr.result.n == 1) {
                res.json({ ok: true, modified: (cr.result.nModified == 1) });
            } else if (cr.result.n == 1) {
                res.json({ ok: false, msg: 'Meybe this user doesnt own this task. Spoofing here.' });
            } else {
                res.json({ ok: false, msg: 'could not update for some databse reason.' });
            }
        } catch (e) {
            res.json({ ok: false, msg: 'not updated, the Id provided is not approproate' })
        }
    }
});

// complete one
router.put('/complete', async (req, res) => {
    if (!req.body.id) {
        res.status(400);
        return res.json({ ok: false, msg: 'send an id with request' })
    } else {
        const id = new ObjectId(req.body.id);
        let data = {};
        data.updatedOn = new Date().getTime();
        try {
            let cr = await db.tasks.update({
                _id: id,
                owner: req.username
            }, {
                    '$set': {
                        pending: false,
                        updatedOn: new Date().getTime()
                    }
                }
            );
            console.log('Yo update ', cr.result);
            if (cr.result.n == 1) {
                res.json({ ok: true, modified: (cr.result.nModified == 1) });
            } else if (cr.result.n == 1) {
                res.json({ ok: false, msg: 'Meybe this user doesnt own this task. Spoofing here.' });
            } else {
                res.json({ ok: false, msg: 'could not update for some databse issue.' });
            }
        } catch (e) {
            res.json({ ok: false, msg: 'not updated, the Id provided is not approproate' })
        }
    }
});

// delete one
router.delete('/', async (req, res) => {
    console.log('yolo ', req.body);
    if (!req.body.id) {
        res.status(400);
        return res.json({ ok: false, msg: 'send an id with request' })
    } else {
        const id = new ObjectId(req.body.id);
        try {
            let cr = await db.tasks.remove({
                _id: id,
                owner: req.username
            }, {
                    justOne: true
                }
            );
            console.log('Yo remove ', cr.result);
            if (cr.result.ok == 1) {
                res.json({ ok: true, removed: (cr.result.n == 1) });
            } else if (cr.result.n == 1) {
                res.json({ ok: false, msg: 'Meybe this user doesnt own this task. Spoofing here.' });
            } else {
                res.json({ ok: false, msg: 'could not delete for some databse reason.' });
            }
        } catch (e) {
            res.json({ ok: false, msg: 'not updated, the Id provided is not approproate' })
        }
    }
});
