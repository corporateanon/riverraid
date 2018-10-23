const mutate = ([left, right], step, out) => {
    const dLeft = Math.random() * 2 * step - step;
    const dRight = Math.random() * 2 * step - step;
    left += dLeft;
    right += dRight;
    out[0] = left;
    out[1] = right;
};

const checkConstraints = (left, right, minGate, lBound, rBound, minBank) => {
    if (right - left < minGate) {
        return false;
    }
    if (left - lBound < minBank) {
        return false;
    }
    if (rBound - right < minBank) {
        return false;
    }
    return true;
};

function* riverLineGenerator() {
    const step = 1 / 30;
    const lBound = 0;
    const rBound = 1;
    const minGate = 1 / 10;
    const minBank = 1 / 100;

    const cur = [0.3, 0.6];
    const next = [0, 0];

    while (true) {
        do {
            mutate(cur, step, next);
        } while (
            !checkConstraints(
                next[0],
                next[1],
                minGate,
                lBound,
                rBound,
                minBank
            )
        );
        cur[0] = next[0];
        cur[1] = next[1];
        yield cur;
    }
}

exports.riverLineGenerator = riverLineGenerator;
