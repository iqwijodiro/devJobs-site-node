document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector('.skill-list');

    let alerts = document.querySelector('.alerts')

    // if (alerts) {
        removeAlerts();
    // }

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

const removeAlerts = () => {
    const alerts = document.querySelector('.alerts')

    const interval = setInterval(()=>{
        // console.log('2segundos');
        if (alerts.children.length > 0) {
            alerts.removeChild(alerts.children[0])
        } else if (alerts.children.length === 0) {
            alerts.parentElement.removeChild(alerts);
            clearInterval(interval);
        }
    }, 3000)
}

// alert('works')