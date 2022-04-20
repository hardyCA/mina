<!-- <script>
    import { onMount } from "svelte";
    import { Plane } from "svelte-loading-spinners";
    let data = {};
    let time = new Date();
    let carga = false;
    var myHeaders = new Headers();
    myHeaders.append("x-access-token", "goldapi-6rn18l1wvf68d-io");
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    fetch("https://www.goldapi.io/api/XAU/USD", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            data = JSON.parse(result);
            console.log(data);
            carga = true;
        })
        .catch((error) => console.log("error", error));

    const cargarOro = () => {
        var myHeaders = new Headers();
        myHeaders.append("x-access-token", "goldapi-6rn18l1wvf68d-io");
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        fetch("https://www.goldapi.io/api/XAU/USD", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                data = JSON.parse(result);
                console.log(data);
            })
            .catch((error) => console.log("error", error));
    };

    onMount(() => {
        const interval = setInterval(() => {
            time = new Date();
            console.log(time);
            cargarOro();
        }, 90000);

        return () => {
            clearInterval(interval);
        };
    });
</script>

<div class="col-xl-3 col-sm-6">
    <div class="card">
        <div
            class="card-body d-flex align-items-center justify-content-between"
        >
            {#if carga}
                <div class="card-data me-2">
                    <h5>GOLD / USD DOLLAR</h5>
                    <h2 class="fs-40 font-w600">{data.price}</h2>
                    <small class="text-success">{data.chp}% ({data.ch})</small>
                </div>
                <div>
                    <img src="images/oro.png" width="50" alt="" />
                </div>
            {:else}
                <div class="card-data me-2">
                    <center>
                        <Plane />
                    </center>
                </div>
            {/if}
        </div>
    </div>
</div> -->
