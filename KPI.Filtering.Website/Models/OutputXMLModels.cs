using System.Collections.Generic;

namespace KPI.Filtering.Website.Models
{
    public class OutputDataSource
    {
        public string Name { get; set; }
        public List<Constraint> Constraints { get; set; }
        public KPIJoin JoinDetails { get; set; }
    }

    public class Constraint
    {
        public string Operation { get; set; }
        public string Attribute { get; set; }
        public string Comparator { get; set; }
        public string Operand { get; set; }
    }

    public class KPIJoin
    {
        public string On { get; set; }
        public string Operation { get; set; }
        public OutputDataSource JoinDataSource { get; set; }
    }
}