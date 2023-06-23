const getStep = (from: {x: number, y: number}, to: {x: number, y: number}) => {
    return {x: (to.x-from.x)/2, y: (to.y-from.y)/2};
}

export { getStep };
