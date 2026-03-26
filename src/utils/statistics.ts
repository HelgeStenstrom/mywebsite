function getSum(data: number[]) {
    return data.reduce((acc, val) => acc + val, 0);
}

export function average(data: number[]):number | null {
    if (data.length == 0) {
        return null;
    }

    const sum = getSum(data);
    return sum / data.length;

}

export function standardDeviation(data: number[]):number | null {
    if (data.length == 0) {
        return null;
    }

    const avg = average(data);
    const squareDiffs = data.map(value => {
        const diff = value - avg!;
        return diff*diff;
    });
    const variance = average(squareDiffs);
    return Math.sqrt(variance!);



}

