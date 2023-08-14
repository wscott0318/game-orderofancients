export const pauseEvent = (e: any) => {
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
};

export const COLOR_NUMBER = (value: number) => value / 255;

export const PERCENT2VALUE = (percent: number) => percent / 100;

export const CONVERT_TIME = (value: number) => {
    let seconds: any = value;

    const hours =
        Math.floor(seconds / 3600) >= 10
            ? Math.floor(seconds / 3600)
            : "0" + Math.floor(seconds / 3600);
    seconds = seconds % 3600;

    const minutes =
        Math.floor(seconds / 60) >= 10
            ? Math.floor(seconds / 60)
            : "0" + Math.floor(seconds / 60);
    seconds = seconds % 60 >= 10 ? seconds % 60 : "0" + (seconds % 60);

    return `${hours}:${minutes}:${seconds}`;
};
