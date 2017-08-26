jQuery(function(){
    $(document).ready(function(){ 
        $(".tdRevert").click(tdRevert); 
        $(".tdDelete").click(tdDelete); 
        $(".tdUpdate").click(tdUpdate); 
        $("#BTCMD").click();
        $("#BTCMD").click(function(){
            $.ajax({
            url: '/shell',
            type: 'post',
            data: 'cmd='+$('#cmd').val(),
            success: function(result) {
            $("#cmdshell").html(result);
            }
            });
        });
        
        $(function(){
            $("#cmd").bind('keypress',function(event){
                if(event.keyCode == "13")    
                {
                    $("#BTCMD").click();
                }
            });
        });

    })
});