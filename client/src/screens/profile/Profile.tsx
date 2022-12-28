
import React, { useContext, useRef, useState } from 'react'
import { AuthContext, PopupContext } from '../..';
import "./profile.scss"
import { debug } from 'console';
import { Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { TOAST_LVL } from '../../constants/constants';


function Profile() {
	const {user} = useContext(AuthContext)
	const {open_confirm, set_toast} = useContext(PopupContext)

	let user_name = useRef("");
	let old_password = useRef("");
	let new_password = useRef("");

	const save_changes = () => {
		set_toast(TOAST_LVL.SUCCESS, "Updated", "Your profile has been correctly updated");
	}

	const change_password = () => {
		set_toast(TOAST_LVL.SUCCESS, "Updated", "Your password has been correctly updated");
	}

	return (
		<div id='profile-main'>
			<h1>My profile</h1>
			<p>Manage your profile settings</p>

			<div className='update-picture-container'>
				<h2>My profile picture</h2>
				<div className='img-edit'>
					<img src={`https://avatars.dicebear.com/api/adventurer/${user.name}.svg`} />
					<div className="profile-picture-edit">
						<Button variant="contained" onClick={() => console.log("first")}>Change picture</Button>
						<Button sx={{color: "red"}} variant="outlined" startIcon={<DeleteIcon />} onClick={() => open_confirm("Delete profile picture", "You will remove your profile picture. This action is definitive. A random profile picture will be created for you", "Delete my picture", () => console.log("delete"))}>Delete</Button>
					</div>
				</div>
			</div>
			<div className='update-container'>
				<h2>My data</h2>
				<TextField defaultValue={user.name} fullWidth  className='value-input' id="outlined-basic" label={"User name"} variant="outlined" />
				<TextField defaultValue={user.email} fullWidth  className='value-input' id="outlined-basic" label={"User name"} variant="outlined" />
			</div>
			<div className='change-password'>
				<h2>Change password</h2>
				<div className='password-row'>
					<TextField fullWidth  className='value-input' id="outlined-basic" label={"Old password"} variant="outlined" />
					<TextField fullWidth  className='value-input' id="outlined-basic" label={"New password"} variant="outlined" />
					<Button variant="contained" onClick={() => change_password()}>Save password</Button>
				</div>
			</div>
			<div className='update-footer'>
				<Button variant="outlined" onClick={() => console.log("first")}>Cancel</Button>
				<Button variant="contained" onClick={() => save_changes()}>Save changes</Button>
			</div>
		</div>
	)
}

export default Profile
