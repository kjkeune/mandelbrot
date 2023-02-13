
class ComplexPoint
{
    public:
        double re;
        double im;
        unsigned int itr;

        ComplexPoint(double re, double im);

        ComplexPoint operator+(const ComplexPoint& b);
        ComplexPoint operator-(const ComplexPoint& b);
        ComplexPoint operator*(const ComplexPoint& b);
        double absPow2();
        double abs();
};

