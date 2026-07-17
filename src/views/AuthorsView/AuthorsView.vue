<template src="./template.html"></template>
<style src="./style.css"></style>
<script>
    import fm from 'front-matter'

    export default {
        data() {
            return {
                blogs: [],
                loading: false,
                error: false,
                baseUrl: import.meta.env.BASE_URL || '/'
            }
        },
    }
</script>