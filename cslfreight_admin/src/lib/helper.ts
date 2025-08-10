export const FormattedDate = (date:Date) => {
    return date.toLocaleDateString("default", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    })
}

export const FormattedTime = (date:Date) => {
    return date.toLocaleTimeString("default", {
        timeZone: "UTC",
    })
}

export const DownloadFile = (fileUrl: string, filename: string) => {
    const aTag = document.createElement("a")
    aTag.href=fileUrl
    aTag.setAttribute("download", filename)
    document.body.appendChild(aTag)
    aTag.click()
    aTag.remove()
}

export const GetTierBadgeClass = (priority?: number) => {
    switch (priority) {
        case 1:
            return "bg-[#ffdbb7] text-[#cd7f32]"; // Bronze
        case 2:
            return "bg-[#f1f1f1] text-[#c0c0c0]"; // Silver
        case 3:
            return "bg-amber-100 text-amber-600"; // Gold
        case 4:
            return "bg-emerald-100 text-emerald-600"; // Platinum
        case 5:
            return "bg-cyan-100 text-cyan-600"; // Diamond or custom
        default:
            return "bg-[#ffdbb7] text-[#cd7f32]";
    }
};

export const TimeLeft = (time: string) => {
    const now = Date.now()
    const endTime = new Date(time).getTime()
    const diff = endTime - now
    if (diff <= 0){
        return new Date(endTime).toDateString()
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((diff / (1000 * 60 )) % 60)
    return `${days}d ${hours}h ${minutes}m left`
}
