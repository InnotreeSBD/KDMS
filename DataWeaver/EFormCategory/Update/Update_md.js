//==============================================================================
var ApUserID = ODS.GetUserID();
var ApDt = ODS.Now().FormatString("yyyy-MM-dd HH:mm:ss");
//==============================================================================


var dbconn = ODS.GetConnection();


//ST01
var sql;
var record_count_1 = Request.SUB_GetRecordCount("ST01");
for( var i = 0 ; i < record_count_1 ; i++ )
{
    var modify_flag = Request.SUB_GetCellData("ST01", "ods_modify_flag", i);
    if( modify_flag == 1 )
    {
        sql ="INSERT INTO EFormCategory(CatCd, Lv, CatNm \r\n"
             +"    , CmpyCd, ParentCd, Remarks \r\n"
             +"    , ApUserID, ApDt) \r\n"
             +"VALUES(  @CatCd, @Lv, @CatNm \r\n"
             +"    , @CmpyCd, @ParentCd, @Remarks \r\n"
             +"    , @ApUserID, @ApDt) \r\n"
    }
    else if( modify_flag == 2 )
    {
        sql ="UPDATE EFormCategory SET  \r\n"
             +"CatNm=@CatNm \r\n"
             +"    , CmpyCd=@CmpyCd, ParentCd=@ParentCd, Remarks=@Remarks \r\n"
             +"    , UpUserID=@UpUserID, UpDt=@UpDt \r\n"
             +"WHERE CatCd=@CatCd AND Lv=@Lv \r\n"
    }
    else if( modify_flag == 3 )
    {
        sql ="DELETE FROM EFormCategory \r\n"
             +"WHERE ParentCd=@CatCd AND Lv < @Lv \r\n"
             +"DELETE FROM EFormCategory \r\n"
             +"WHERE CatCd=@CatCd AND Lv=@Lv \r\n"
    }
    dbconn.AddParameterList(sql, "ST01", i);
    dbconn.AddParameter("@ApUserID", ApUserID);
    dbconn.AddParameter("@ApDt", ApDt);
    dbconn.AddParameter("@UpUserID", ApUserID);
    dbconn.AddParameter("@UpDt", ApDt);
    
    ODS.TraceQueryState("update_md_ST01_"+i, sql, dbconn);
    var count = dbconn.ExecuteNonQuery(sql);
    
    Response.SUB_SetCellData("ST01", "CatCd", i, Request.SUB_GetCellData("ST01", "CatCd", i));
}



//ST02
var record_count_2 = Request.SUB_GetRecordCount("ST02");
for( var i = 0 ; i < record_count_2 ; i++ )
{
    var modify_flag = Request.SUB_GetCellData("ST02", "ods_modify_flag", i);
    if( modify_flag == 1 )
    {
        sql ="INSERT INTO EFormCategory(CatCd, Lv, CatNm \r\n"
             +"    , CmpyCd, ParentCd, Remarks \r\n"
             +"    , ApUserID, ApDt) \r\n"
             +"VALUES(  @CatCd, @Lv, @CatNm \r\n"
             +"    , @CmpyCd, @ParentCd, @Remarks \r\n"
             +"    , @ApUserID, @ApDt) \r\n"
    }
    else if( modify_flag == 2 )
    {
        sql ="UPDATE EFormCategory SET  \r\n"
             +"CatNm=@CatNm \r\n"
             +"    , CmpyCd=@CmpyCd, ParentCd=@ParentCd, Remarks=@Remarks \r\n"
             +"    , UpUserID=@UpUserID, UpDt=@UpDt \r\n"
             +"WHERE CatCd=@CatCd AND Lv=@Lv \r\n"
    }
    else if( modify_flag == 3 )
    {
        sql ="DELETE FROM EFormCategory \r\n"
             +"WHERE ParentCd=@CatCd AND Lv < @Lv \r\n"
             +"DELETE FROM EFormCategory \r\n"
             +"WHERE CatCd=@CatCd AND Lv=@Lv"
    }
    dbconn.AddParameterList(sql, "ST02", i);
    dbconn.AddParameter("@ApUserID", ApUserID);
    dbconn.AddParameter("@ApDt", ApDt);
    dbconn.AddParameter("@UpUserID", ApUserID);
    dbconn.AddParameter("@UpDt", ApDt);
    
    ODS.TraceQueryState("update_md_ST02_"+i, sql, dbconn);
    var count = dbconn.ExecuteNonQuery(sql);
    
    Response.SUB_SetCellData("ST02", "CatCd", i, Request.SUB_GetCellData("ST02", "CatCd", i));
}



//ST03
var record_count_3 = Request.SUB_GetRecordCount("ST03");
for( var i = 0 ; i < record_count_3 ; i++ )
{
    var modify_flag = Request.SUB_GetCellData("ST03", "ods_modify_flag", i);
    if( modify_flag == 1 )
    {
        sql ="INSERT INTO EFormCategory(CatCd, Lv, CatNm \r\n"
             +"    , CmpyCd, ParentCd, Remarks \r\n"
             +"    , ApUserID, ApDt) \r\n"
             +"VALUES(  @CatCd, @Lv, @CatNm \r\n"
             +"    , @CmpyCd, @ParentCd, @Remarks \r\n"
             +"    , @ApUserID, @ApDt) \r\n"
    }
    else if( modify_flag == 2 )
    {
        sql ="UPDATE EFormCategory SET  \r\n"
             +"CatNm=@CatNm \r\n"
             +"    , CmpyCd=@CmpyCd, ParentCd=@ParentCd, Remarks=@Remarks \r\n"
             +"    , UpUserID=@UpUserID, UpDt=@UpDt \r\n"
             +"WHERE CatCd=@CatCd AND Lv=@Lv \r\n"
    }
    else if( modify_flag == 3 )
    {
        sql ="DELETE FROM EFormCategory \r\n"
             +"WHERE CatCd=@CatCd AND Lv=@Lv"
    }
    dbconn.AddParameterList(sql, "ST03", i);
    dbconn.AddParameter("@ApUserID", ApUserID);
    dbconn.AddParameter("@ApDt", ApDt);
    dbconn.AddParameter("@UpUserID", ApUserID);
    dbconn.AddParameter("@UpDt", ApDt);
    
    ODS.TraceQueryState("update_md_ST03_"+i, sql, dbconn);
    var count = dbconn.ExecuteNonQuery(sql);
    
    Response.SUB_SetCellData("ST03", "CatCd", i, Request.SUB_GetCellData("ST03", "CatCd", i));
}