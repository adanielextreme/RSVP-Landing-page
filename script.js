document.addEventListener('DOMContentLoaded', () => {
	const state = { attendees: [] }

	function setState(patch) {
		Object.assign(state, patch)
		render()
	}

	function render() {
		const listEl = document.getElementById('attendeesList')
		const summaryEl = document.getElementById('summary')
		if (!listEl || !summaryEl) return
		listEl.innerHTML = ''

		const total = state.attendees.length
		const attending = state.attendees.filter(a => a.attending).length
		summaryEl.innerHTML = `<div class="mb-2"><strong>${attending}</strong> attending • ${total} responded</div>`

		const stateDump = document.getElementById('stateDump')
		if (stateDump) stateDump.textContent = JSON.stringify(state, null, 2)

		if (total === 0) {
			listEl.innerHTML = '<li class="list-group-item">No responses yet</li>'
			return
		}

		state.attendees.forEach((p, i) => {
			const li = document.createElement('li')
			li.className = 'list-group-item d-flex justify-content-between align-items-center'

			const left = document.createElement('div')
			const name = document.createElement('div')
			name.innerHTML = `<strong>${escapeHtml(p.name)}</strong>`
			const meta = document.createElement('div')
			meta.className = 'text-muted small'
			meta.textContent = p.attending ? 'Attending' : 'Not attending'
			left.appendChild(name)
			left.appendChild(meta)

			const right = document.createElement('div')
			const remove = document.createElement('button')
			remove.className = 'btn btn-sm btn-outline-danger me-2'
			remove.textContent = 'Remove'
			remove.onclick = () => { state.attendees.splice(i,1); setState({ attendees: state.attendees }) }

			const toggle = document.createElement('button')
			toggle.className = 'btn btn-sm btn-outline-secondary'
			toggle.textContent = p.attending ? 'Set Not Attending' : 'Set Attending'
			toggle.onclick = () => { p.attending = !p.attending; setState({ attendees: state.attendees }) }

			right.appendChild(remove)
			right.appendChild(toggle)

			li.appendChild(left)
			li.appendChild(right)
			listEl.appendChild(li)
		})
	}

	function escapeHtml(s) { return String(s).replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c])) }

	const formEl = document.getElementById('rsvpForm')
	if (formEl) {
		formEl.addEventListener('submit', e => {
			e.preventDefault()
			const name = document.getElementById('nameInput').value.trim()
			const attending = document.getElementById('attendSelect').value === 'yes'
			if (!name) return
			state.attendees.push({ name, attending })
			formEl.reset()
			setState({ attendees: state.attendees })
		})
	} else {
		console.warn('rsvpForm element not found')
	}

	render()
})
