module.exports = {
    paramsMapValidator: function (params, keys) {
        let missing = [];
        let obj = {};
        keys.forEach((e) => {
            if (!params[e]) {
                missing.push(e);
            } else {
                obj[e] = (params[e]);
            }
        });
        if (missing.length == 0) {
            return obj;
        }
        else {
            return { missing: missing, obj: obj };
        }
    }
}