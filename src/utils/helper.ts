export const pauseEvent = (e: any) => {
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
};

export const COLOR_NUMBER = (value: number) => value / 255;

export const PERCENT2VALUE = (percent: number) => percent / 100;
