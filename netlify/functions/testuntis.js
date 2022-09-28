const WebUntisLib = require("webuntis");
const untis = new WebUntisLib('htl1-innsbruck', 'Marcel.Maffey', 'Eingang_1', 'neilo.webuntis.com');
// new WebUntisLib.WebUntisAnonymousAuth(
//     "htl1-innsbruck",
//     "neilo.webuntis.com"
// );

const test = async () => {
    await untis.login();
    const exams = await untis.getExamsForRange(new Date(2022, 09, 28),
        new Date(2023, 09, 28), 4368, false, true)
    console.log(exams)
}

test()