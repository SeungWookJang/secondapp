import { parseExpression } from 'cron-parser';

export function getNextScheduledTime(schedule: string, tz: string): string {
    let out = '';
    try {
        out = parseExpression(schedule, {utc: !tz, tz})
            .next()
            .toISOString();
    } catch (e) {
        // Do nothing
    }
    return out;
}
