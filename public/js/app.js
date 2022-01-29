document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector('.skill-list');

    if (skills) {
        skills.addEventListener('click', addSkills);
    }
})

const skills = new Set();
const addSkills = e => {
    if (e.target.tagName === 'LI') {
        if (e.target.classList.contains('active')) {
            //remove from the set & take off the class
            skills.delete(e.target.textContent);
            e.target.classList.remove('active')
        } else {
            // add to set & put on the class
            skills.add(e.target.textContent);
            e.target.classList.add('active')
        }
    }

    const skillsArray = [...skills]
    document.querySelector('#skills').value = skillsArray;
}