const getStep = (from: {x: number, y: number}, to: {x: number, y: number}) => {
    return {x: (to.x-from.x)/3, y: (to.y-from.y)/3};
}

export { getStep };
