#include "fractal.h"

bool isIncluded(ComplexPoint& c, int maxItr) {
    ComplexPoint z = ComplexPoint(0.0, 0.0);
    for (int i = 0; i <= maxItr; i++) {
        z = z * z + c;
        if (z.absPow2() > 4.0) {
            c.itr = i;
            return false;
        }
    }
    c.itr = maxItr;
    return true;
}