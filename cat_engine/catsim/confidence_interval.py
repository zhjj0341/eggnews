import numpy as np
import scipy.stats
import pdb


def mean_confidence_interval(data, confidence=0.90):
  a = 1.0 * np.array(data)
  n = len(a)
  m, se = np.mean(a), scipy.stats.sem(a)
  h = se * scipy.stats.t.ppf((1 + confidence) / 2., n - 1)
  return m, m - h, m + h


pdb.set_trace()
mean_confidence_interval(range(0, 6), 0.4)

# 0.90
# data = range(2, 6) -> (3.5, 1.980910434906507, 5.019089565093493)
# data = range(2, 5) -> (3.0, 1.314145539151917, 4.685854460848083)

# 0.95
# data = range(2, 6) -> (3.5, 1.445739743239121, 5.5542602567608785)
# data = range(2, 5) -> (3.0, 0.5158622881562471, 5.484137711843752)