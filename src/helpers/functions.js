export function saveToken(token){
    sessionStorage.setItem('idToken',token)
    const expiresIn = new Date().getTime() + 24*60*60*1000  //expired after 24 houres
    sessionStorage.setItem('expiresIn',expiresIn)
}

export function getToken(){
    const expiresIn = +sessionStorage.getItem('expiresIn')
    if(new Date().getTime() > expiresIn){
        sessionStorage.removeItem('expiresIn')
        sessionStorage.removeItem('idToken')
        return ''
    }
    const token = sessionStorage.getItem('idToken')
    return (!! token) ? token : ''
}

export function clearToken(){
    sessionStorage.removeItem('expiresIn')
    sessionStorage.removeItem('idToken')
}

export function err_Msg(){
    return 'unexpected error occured !! open console for more info'
}