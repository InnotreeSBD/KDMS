

function Form_Load(  )
{
    DATE_from.AddYears(-1);
	Form.DialogParamSet("ReturnCount", 0);
}

function BTN_1_Click(  )
{
    var SRCH_Val = {};
    SRCH_Val["ST_Date"] = DATE_from.GetValue();
    DATE_to.AddDays(1);
    SRCH_Val["ED_Date"] = DATE_to.GetValue();
    SRCH_Val["Text_val"] = TXT_1.GetText();
    Form.DialogParamSet("srch_val", JSON.stringify(SRCH_Val));
	Form.DialogParamSet("ReturnCount", 1);
    Form.CloseView(1);
}
