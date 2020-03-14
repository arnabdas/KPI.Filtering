using System.Collections.Generic;

namespace KPI.Filtering.Web.Models
{
    public class ColumnDetails
    {
        public string Label { get; set; }
        public bool IsEnumeration { get; set; }

        private List<string> _enumeration = null;
        public List<string> Enumeration
        {
            get
            {
                if (_enumeration == null)
                {
                    _enumeration = new List<string>();
                }
                return _enumeration;
            }
            set
            {
                _enumeration = value;
            }
        }
    }
}
