// Code generated by templ - DO NOT EDIT.

// templ: version: v0.2.598
package views

//lint:file-ignore SA4006 This context is only used if a nested component is present.

import "github.com/a-h/templ"
import "context"
import "io"
import "bytes"

func Contact() templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, templ_7745c5c3_W io.Writer) (templ_7745c5c3_Err error) {
		templ_7745c5c3_Buffer, templ_7745c5c3_IsBuffer := templ_7745c5c3_W.(*bytes.Buffer)
		if !templ_7745c5c3_IsBuffer {
			templ_7745c5c3_Buffer = templ.GetBuffer()
			defer templ.ReleaseBuffer(templ_7745c5c3_Buffer)
		}
		ctx = templ.InitializeContext(ctx)
		templ_7745c5c3_Var1 := templ.GetChildren(ctx)
		if templ_7745c5c3_Var1 == nil {
			templ_7745c5c3_Var1 = templ.NopComponent
		}
		ctx = templ.ClearChildren(ctx)
		_, templ_7745c5c3_Err = templ_7745c5c3_Buffer.WriteString("<div class=\"container\"><h1>Contact Us</h1><form hx-post=\"/api/contact\" hx-swap=\"none\" hx-on::after-request=\"if(event.detail.successful) this.reset()\"><div><label>First Name</label> <input placeholder=\"John\" name=\"firstName\"></div><div><label>Last Name</label> <input placeholder=\"Smith\" name=\"lastName\"></div><div><label>Email Address</label> <input placeholder=\"john.smith@email.com\" name=\"emailAddress\"></div><div><label>Phone Number</label> <input placeholder=\"0412345678\" name=\"phoneNumber\"></div><div><label>Subject</label> <select name=\"subject\" id=\"pet-select\"><option value=\"general\">General Enquiry</option> <option value=\"sponsor\">Sponsor Enquiry</option> <option value=\"fundraising\">Fundraising Enquiry</option> <option value=\"advertising\">Advertising Enquiry</option> <option value=\"runningTip\">Running Tip</option></select></div><div><label>Comments</label> <textarea placeholder=\"Write your comment here\" name=\"comments\"></textarea></div><button type=\"submit\">Submit</button></form></div>")
		if templ_7745c5c3_Err != nil {
			return templ_7745c5c3_Err
		}
		if !templ_7745c5c3_IsBuffer {
			_, templ_7745c5c3_Err = templ_7745c5c3_Buffer.WriteTo(templ_7745c5c3_W)
		}
		return templ_7745c5c3_Err
	})
}
