export function checkConsiderablePercentageMovement(oldValue: number, newValue: number, validPercentage: number) :boolean {

    if (newValue == 0) return false;

    let percentageMove = ((oldValue / newValue) - 1) * 100;

    if (percentageMove < 0) percentageMove *= -1;

    return percentageMove >= (validPercentage * 100);
}