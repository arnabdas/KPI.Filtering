using System.Collections.Generic;

namespace KPI.Filtering.POC.Models
{
    public class KPIDataSource
    {
        public string Name { get; set; }
        private List<ColumnDetails> _columns = new List<ColumnDetails>();
        public List<ColumnDetails> Columns
        {
            get
            {
                if (_columns == null)
                {
                    _columns = new List<ColumnDetails>();
                }
                return _columns;
            }
        }
    }
}
