<template>
	<article class="content">
		<article class="content_flex">
			<section class="half_size flex">
				<h1 class="display-1 centered_text create_header white">Create Account<br> Now</h1>
			</section>
			<section class="half_size">
				<section class="create_form">
					<form @submit="register">
						<h1 class="display-4 centered_text white">Fill the form</h1>

						<div class="margin_bottom">
							<label class="turquoise"><i class="fas fa-user"></i> Username</label>
							<input type="text" class="input_form blackground white" v-model="username" maxlength="30" minlength="3"
								pattern="[\w_]+" title="Username can contain only letters, digits and underscores" required>
						</div>
						<div class="margin_bottom">
							<label class="turquoise"><i class="fas fa-user"></i> Email</label>
							<input type="email" class="input_form blackground white" v-model="email" maxlength="50" required>
						</div>
						<div class="margin_bottom">
							<label class="turquoise"><i class="fas fa-user"></i> Password</label>
							<input type="password" class="input_form blackground white" v-model="password" maxlength="30" minlength="6"
								pattern="[\w_]+" title="Username can contain only letters, digits and underscores" required>
						</div>
						<div class="margin_bottom">
							<label class="turquoise"><i class="fas fa-user"></i> Confirm Password</label>
							<input type="password" class="input_form blackground white" v-model="confirm" maxlength="30" minlength="6" required>
						</div>

						<div class="form-check">
							<input class="form-check-input" type="checkbox" v-model="remember">
							<label class="form-check-label turquoise">Remember me</label>
						</div>

						<input type="submit" class="btn btn-outline-light float_right margin_top" value="Register" :disabled='isDisabled' />
					</form>
				</section>
			</section>
		</article>
	</article>
</template>

<script>
import Toast from '../assets/js/toasts';

export default {
	name: "Register",
	data: function() {
		return {
			username: "",
			email: "",
			password: "",
			confirm: "",
			remember: false,
			isDisabled: false,
		};
	},
	methods: {
		register: async function(e) {
			e.preventDefault();
			this.isDisabled = true;
			if(this.password !== this.confirm) {
				Toast.ShowToastMessage("Error", "Passwords aren't the same", "text-danger");
				this.isDisabled = false;
				return;
			}
			
			const data = {
				"Username": this.username,
				"Email": this.email,
				"Password": this.password,
				"RememberMe": this.remember,
			};
			const fetchOptions = {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Accept': 'application/json; charset=utf-8',
					'Content-Type': 'application/json; charset=UTF-8',
				},
				body: JSON.stringify(data),
			};
			
			let res;
			try {
				res = await fetch("https://localhost:44360/api/Users", fetchOptions);
			}
			catch (error) {
				console.log(error);
				return;
			}

			const status = res.status;
			if (status === 201) {
				const user = await res.json();
				
				localStorage.setItem("username", user.username ? user.username : "");
                localStorage.setItem("email", user.email ? user.email : "");
                localStorage.setItem("logoUrl", user.logoUrl ? user.logoUrl : "");
				
				this.$router.go("Home");
				return;
			}

			this.isDisabled = false;
			if (status === 403) {
				Toast.ShowToastMessage("Warning", await res.text(), "text-warning");
			}
			else {
				Toast.ShowToastMessage("Error", await res.text(), "text-danger");
			}
		}
	},
}
</script>