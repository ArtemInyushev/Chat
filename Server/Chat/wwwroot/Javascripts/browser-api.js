﻿window.onload = async function () {
    if (await AuthenticateUser()) {
        RenderMainPage();
    }
    else {
        GoToLoginPage();
    }

    //$(".toast").toast({ autohide: false });
    //$(".toast").toast("show");
    //setTimeout(() => {
    //    $(".toast").toast({ autohide: false });
    //    $(".toast").toast("show");
    //}, 10000);

    //setTimeout(() => {
    //    const lastToast = $(".toast").last();
    //    lastToast.toast("hide");
    //    $('.toast-container').prepend(lastToast);
    //    lastToast.toast("show");
    //    lastToast.toast("show");
    //}, 2000);
}

async function LoginAction(e) {
    e.preventDefault();
    const login_button = $(":submit");
    login_button.prop("disabled", true);

    const username = $(":text").val();
    const password = $(":password").val();
    const remember = $(":checkbox").is(":checked");
    const data = {
        "Username": username,
        "Password": password,
        "RememberMe": remember,
    }
    const res = await LoginUser(data);
    const status = res.status;
    if (status === 200) {
        const user = await res.json();

        let storage;
        if (remember) {
            storage = localStorage;
        }
        else {
            storage = sessionStorage;
        }
        storage.setItem("username", user.username ? user.username : "");
        storage.setItem("email", user.email ? user.email : "");
        storage.setItem("logoUrl", user.logoUrl ? user.logoUrl : "");
        RenderMainPage();
        return;
    }
    else {
        login_button.prop("disabled", false);
        await ShowToastMessage("Error", await res.text(), "text-danger");
    }
}

async function LogoutAction() {
    await LogoutUser();
    GoToLoginPage();
}

async function GetNewUser(e) {
    e.preventDefault();
    const register_button = $("#register");
    register_button.prop("disabled", true);

    const password = $("#password").val();
    const confirm = $("#confirm").val();
    if (password != confirm) {
        await ShowToastMessage("Error", "Passwords aren't the same", "text-danger");
        register_button.prop("disabled", false);
        return;
    }
    const username = $("#username").val();
    const email = $("#email").val();
    const remember = $("#remember").is(":checked");
    console.log(username, email, password, remember);

    const data = {
        "Username": username,
        "Email": email,
        "Password": password,
        "RememberMe": remember,
    };
    const res = await AddUser(data);
    const status = res.status;
    if (status === 201) {
        const user = await res.json();
        console.log(user);
        RenderMainPage();
        return;
    }

    register_button.prop("disabled", false);
    if (status === 403) {
        await ShowToastMessage("Warning", await res.text(), "text-warning");
    }
    else {
        await ShowToastMessage("Error", await res.text(), "text-danger");
    }
}

function GoToLoginPage() {
    RenderLoginPage();
}

function GoToCreateAccountPage() {
    RenderCreateAccountPage();
}