
export function timeSince(to) {
    var seconds = Math.floor((new Date() - to) / 1000);
    var interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

export function strFromDuration(duration) {
    var seconds = Math.floor(duration / 1000);
    var interval = Math.floor(seconds / 31536000);
    var ret = "";
    if (interval > 1) {
        ret += interval + " years ";
        seconds -= interval * 31536000;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        ret += interval + " months ";
        seconds -= interval * 2592000;
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        ret += interval + " days ";
        seconds -= interval * 86400;
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        ret += interval + " hr ";
        seconds -= interval * 3600;
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        ret += interval + " min ";
        seconds -= interval * 60;
    }
    ret += Math.floor(seconds) + " s ";
    return ret;
}

export function dateToString(date) {
    return date.toISOString().replace("T", " ").slice(0, -5);
}