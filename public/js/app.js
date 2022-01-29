document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector('.skill-list');

    if (skills) {
        skills.addEventListener('click', addSkills);

        // When We are editing
        skillsSelected();
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

const skillsSelected = () => {
    const selected = Array.from(document.querySelectorAll('.skill-list .active'));

    selected.forEach( selectedOne => {
        skills.add(selectedOne.textContent);
    })

    // Put in the hidden input
    const skillsArray = [...skills]
    document.querySelector('#skills').value = skillsArray

} 