function f(a) {
  return function (b) {
    return `${a} and ${b}`;
  };
}

console.log(f(5)(6));
