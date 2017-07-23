let router = new express.Router()
module.exports = router;

// get all
router.get('/', async (req, res) => {
    // get username and get his all tasks
    console.log('yolo ', req.username);

    res.json({ ok: true });
});

// create
router.post('/', async (req, res) => {
    console.log('yolo ', req.body);
    let data = helpers.paramsMapValidator([
        'what',
        'due'
    ]);
    if (data.missing) {
        res.json({ ok: false, msg: 'missing params' });
    }
    else {
        let cr = awaitdb.tasks.insert({
            data,
            pending:'true',
            createdOn:new Date().getTime()
        });
        res.json({ ok: true , task:cr.ops[1]});
    }
});

// update one
router.put('/', async (req, res) => {
    console.log('yolo ', req.body);

    res.json({ ok: true });
});

// delete one
router.delete('/', async (req, res) => {
    console.log('yolo ', req.body);

    res.json({ ok: true });
});
