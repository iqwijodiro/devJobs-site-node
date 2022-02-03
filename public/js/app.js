import axios from 'axios';
import Swal from 'sweetalert2';

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

    const vacanciesList = document.querySelector('.admin-panel');

    if (vacanciesList) {
        vacanciesList.addEventListener('click', actionsList)
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

const actionsList = (e) => {
    e.preventDefault();

    if (e.target.dataset.delete) {
        // // Deleted by axios

        Swal.fire({
            title: 'Are you sure you want to delete?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
          }).then((result) => {
            if (result.isConfirmed) {
                const url = `${location.origin}/vacancies/delete/${e.target.dataset.delete}`;
                
                // Send axios´s request to delete
                axios.delete( url, {params: {url}})
                    .then(function(data) {
                        if (data.status === 200) {
                            Swal.fire(
                                'Vacancy Deleted!',
                                data.data,
                                'success'
                              );
                            
                            e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);
                        };
                    })
                    .catch(() =>{
                        Swal.fire({
                            type: 'error',
                            title: 'Request failured',
                            text: 'There was an error in the matrix'
                        })
                    })

            
            }
          })
    } else if (e.target.tagName === 'A'){
        window.location.href = e.target.href;
    }
}