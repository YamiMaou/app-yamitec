let request = {
    data : {},
    formData : function(data){
        this.data = new FormData(data);
    },
    axiosRequest : function(uri){
        return axios.post(uri,this.data)
    },
    submit : function(uri,data,callback=(response)=>{}){
        this.formData(data);

        this.axiosRequest(uri)
        .then((response) => {
            callback(response);
        })
        .catch((error) => {
            callback(error.response);
        });
    },

    makeRequest : function(dataSet,callback=(response)=>{}){
        var that = this;
        $(() => {
            $(document).on("submit", `form[${dataSet}]`, function (event) {
                event.preventDefault();
                let form = $(this);
                let url = form.data(dataSet.split('-')[1]);
                that.submit(url,this,callback);
            })
        });
    }
}
