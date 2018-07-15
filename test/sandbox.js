


class C {
    toJSON () {
        return {x: "abc"};
    }
}

o = new C();

console.log(JSON.stringify(o));
